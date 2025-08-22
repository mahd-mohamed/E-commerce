import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService, ApiResponse } from '../../core/services/products/products.service';
import { Product } from '../../core/models/product.interface';
import { CardComponent } from "../../shared/components/card/card.component";
import { MainSliderComponent } from "./components/main-slider/main-slider.component";
import { PopularCategoriesComponent } from "./components/popular-categories/popular-categories.component";
import { PopularProductsComponent } from "./components/popular-products/popular-products.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,  MainSliderComponent, PopularCategoriesComponent, PopularProductsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent  {

}


