from categories.serializers import CategorySerializer
from accounts.permissions import IsAdminUser
from google import genai as google_genai

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.core.paginator import Paginator
from django.conf import settings

from .models import Product
from .serializers import ProductSerializer, ProductDetailSerializer, ProductWriteSerializer
from categories.models import Category


from django.db.models import Q

# ─── Public Endpoints ────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([AllowAny])
def list_products(request):
    """
    List all available products publicly with optional filtering, searching, and ordering.
    """
    queryset = Product.objects.filter(is_available=True).select_related('vendor', 'category')

    # queryset = Product.objects.all()
    
    # 1. Search Query (?q=)
    query = request.query_params.get('q', '').strip()
    if query:
        queryset = queryset.filter(
            Q(name__icontains=query) | Q(description__icontains=query)
        )
        
    # 2. Category Filter (?category=ID_or_SLUG)
    category_param = request.query_params.get('category')
    if category_param:
        if category_param.isdigit():
            queryset = queryset.filter(category__id=category_param)
        else:
            queryset = queryset.filter(category__slug=category_param)
            
    # 3. Vendor Filter (?vendor=ID_or_SLUG)
    vendor_param = request.query_params.get('vendor')
    if vendor_param:
        if vendor_param.isdigit():
            queryset = queryset.filter(vendor__id=vendor_param)
        else:
            queryset = queryset.filter(vendor__slug=vendor_param)
            
    # 4. Price Filters (?min_price=X & max_price=Y)
    min_price = request.query_params.get('min_price')
    max_price = request.query_params.get('max_price')
    
    if min_price:
        try:
            queryset = queryset.filter(price__gte=float(min_price))
        except ValueError:
            pass # Ignore invalid price inputs securely
            
    if max_price:
        try:
            queryset = queryset.filter(price__lte=float(max_price))
        except ValueError:
            pass
            
    # 5. Ordering (?ordering=price, -price, newest)
    ordering = request.query_params.get('ordering', 'newest')
    if ordering == 'price':
        queryset = queryset.order_by('price')
    elif ordering == '-price':
        queryset = queryset.order_by('-price')
    else: # newest
        queryset = queryset.order_by('-created_at')

    paginator = Paginator(queryset, 15)
    page_number = request.query_params.get('page', 1)
    page_obj = paginator.get_page(page_number)

    serializer = ProductSerializer(page_obj.object_list, many=True)
    return Response(
        {
            "count": paginator.count,
            "total_pages": paginator.num_pages,
            "current_page": page_obj.number,
            "next": page_obj.next_page_number() if page_obj.has_next() else None,
            "previous": page_obj.previous_page_number() if page_obj.has_previous() else None,
            "results": serializer.data,
        },
        status=status.HTTP_200_OK,
    )


@api_view(['GET'])
@permission_classes([AllowAny])
def list_featured_products(request):
    """
    Get all products publicly
    """
    products = Product.objects.filter(is_available=True, featured=True)
    # products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def list_new_arrivals(request):
    """
    Get all new arrivals publicly
    """
    products = Product.objects.filter(is_available=True).order_by('-created_at')[:4]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_product(request, slug):
    """
    Get a single product by ID.
    """
    product = get_object_or_404(Product, slug=slug, is_available=True)
    serializer = ProductDetailSerializer(product)
    return Response(serializer.data, status=status.HTTP_200_OK)

# Alias the old search_products directly to list_products for backward compat
search_products = list_products


# ─── Vendor Endpoints ─────────────────────────────────────────────────────────

def get_approved_vendor(user):
    """
    Helper: returns the vendor profile if the user is an approved vendor, else None.
    """
    if hasattr(user, 'vendor_profile') and user.vendor_profile.is_approved:
        return user.vendor_profile
    return None


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_product(request):
    """
    Approved vendors can create a product.
    """
    vendor = get_approved_vendor(request.user)
    if not vendor:
        return Response(
            {"error": "Only approved vendors can create products."},
            status=status.HTTP_403_FORBIDDEN
        )

    serializer = ProductWriteSerializer(data=request.data)
    if serializer.is_valid():
        category = None
        category_id = request.data.get('category_id')
        if category_id:
            category = get_object_or_404(Category, pk=category_id)

        product = serializer.save(vendor=vendor, category=category)
        return Response(ProductSerializer(product).data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_vendor_products(request):
    """
    Approved vendors can list their own products.
    """
    vendor = get_approved_vendor(request.user)
    if not vendor:
        return Response(
            {"error": "Only approved vendors can access this."},
            status=status.HTTP_403_FORBIDDEN
        )

    products = Product.objects.filter(vendor=vendor).order_by('-created_at')
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_product(request, pk):
    """
    Approved vendors can update their own products.
    """
    vendor = get_approved_vendor(request.user)
    if not vendor:
        return Response(
            {"error": "Only approved vendors can update products."},
            status=status.HTTP_403_FORBIDDEN
        )

    product = get_object_or_404(Product, pk=pk, vendor=vendor)
    serializer = ProductWriteSerializer(product, data=request.data, partial=True)

    if serializer.is_valid():
        category = product.category
        category_id = request.data.get('category_id')
        if category_id:
            category = get_object_or_404(Category, pk=category_id)

        product = serializer.save(category=category)

        # Re-generate slug if name changed
        if 'name' in request.data:
            product.slug = ''
            product.save()

        return Response(ProductSerializer(product).data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_product(request, pk):
    """
    Approved vendors can delete their own products.
    """
    vendor = get_approved_vendor(request.user)
    if not vendor:
        return Response(
            {"error": "Only approved vendors can delete products."},
            status=status.HTTP_403_FORBIDDEN
        )

    product = get_object_or_404(Product, pk=pk, vendor=vendor)
    product.delete()
    return Response({"message": "Product deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


# ─── AI Description Generator ─────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_description(request):
    """
    Generate a product description from a title using Gemini AI.
    Request body: { "title": "Wireless Noise-Cancelling Headphones" }
    """
    vendor = get_approved_vendor(request.user)
    if not vendor:
        return Response(
            {"error": "Only approved vendors can use this feature."},
            status=status.HTTP_403_FORBIDDEN
        )

    title = request.data.get('title', '').strip()
    if not title:
        return Response(
            {"error": "Please provide a product title."},
            status=status.HTTP_400_BAD_REQUEST
        )

    api_key = settings.GEMINI_API_KEY
    if not api_key:
        return Response(
            {"error": "Gemini API key is not configured on the server."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    try:
        client = google_genai.Client(api_key=api_key)

        prompt = (
            f"Write a concise, engaging product description for an e-commerce listing. "
            f"The product is called: '{title}'. "
            f"Keep it between 2-4 sentences. Be clear, professional, and highlight key benefits."
        )

        response = client.models.generate_content(
            # model='gemini-3-flash-preview',
            model='gemini-2.5-flash',
            contents=prompt
        )

        # response = client.models.generate_content(
        #     model='gemini-2.0-flash',
        #     contents=prompt
        # )
        description = response.text.strip()

        return Response({"description": description}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"error": f"Failed to generate description: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def list_categories(request):
    """
    List all categories.
    """
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK) 




# Admin endpoints
@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_list_products(request):
    """
    Admin can list all products, paginated (10 per page).
    Use ?page=N to navigate pages.
    """
    category = request.query_params.get('category', '')
    store_name = request.query_params.get('store_name', '')
    products = Product.objects.all().order_by('-created_at')
    if category:
        products = products.filter(category__name__iexact=category)
    if store_name:
        products = products.filter(vendor__store_name__icontains=store_name)

    paginator = Paginator(products, 10)
    page_number = request.query_params.get('page', 1)
    page_obj = paginator.get_page(page_number)

    serializer = ProductSerializer(page_obj.object_list, many=True)
    return Response(
        {
            "count": paginator.count,
            "total_pages": paginator.num_pages,
            "current_page": page_obj.number,
            "next": page_obj.next_page_number() if page_obj.has_next() else None,
            "previous": page_obj.previous_page_number() if page_obj.has_previous() else None,
            "results": serializer.data,
        },
        status=status.HTTP_200_OK,
    )


@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def admin_toggle_featured(request, pk):
    """
    Admin can toggle the featured status of any product.
    """
    product = get_object_or_404(Product, pk=pk)
    product.featured = not product.featured
    product.save(update_fields=['featured'])
    return Response(
        {
            "message": f"Product {'featured' if product.featured else 'unfeatured'} successfully.",
            "id": product.id,
            "featured": product.featured,
        },
        status=status.HTTP_200_OK,
    )