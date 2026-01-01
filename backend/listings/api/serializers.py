from rest_framework import serializers
from listings.models import Listing

class ListingSerializer(serializers.ModelSerializer):
    
    seller_username = serializers.SerializerMethodField()
    
    def get_seller_username(self, obj):
        return obj.seller.username
    
    class Meta:
        model = Listing
        fields = '__all__'