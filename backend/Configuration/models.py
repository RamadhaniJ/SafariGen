from django.db import models


# Create your models here.

class HeroSectionImages(models.Model):
    class Meta:
        verbose_name = "quote cover photo"
        verbose_name_plural = "quote cover photos"

    image = models.ImageField(upload_to="heroImgs")
    image_tag = models.CharField(max_length=200, choices=[
        ("Serengeti","Serengeti"),
        ("Ngorongoro","Ngorongoro"),
        ("Manyara","Manyara"),
        ("Zanzibar","Zanzibar"),
        ("Island","Island"),
        ("Ruaha","Ruaha"),
        ("Seychelles","Seychelles"),
        ("Selous","Selous"),
        ("Kilimanjaro","Kilimanjaro"),
        ("Meru","Meru"),
        ("Tarangire","Tarangire"),
        ("Rwenzori","Rwenzori"),
        ("MaasaiMara","Maasai Mara"),
        ("StoneTown","StoneTown"),
        ("VictoriaFalls","Victoria Falls"),
    ],
    blank=True, null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Hero configuration images"


class ConfigurationData(models.Model):
    class Meta:
        verbose_name = "vehicle & transit prices"
        verbose_name_plural = "vehicle & transit prices"

    vehicle_rent_pricing = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Price for rent a safari vehicle per day.",
        blank=True,
        null=True
    ) 
    transit_fee_resident = models.DecimalField(
        max_digits=10,
        decimal_places=2, 
        help_text="Transit fee for resident users.",
        blank=True,
        null=True
    )
    transit_fee_non_resident = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Transit fee for non resident users.",
        blank=True,
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Configuration data"
 