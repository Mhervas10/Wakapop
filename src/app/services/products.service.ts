import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  selectedProduct;

  constructor(){}

  setSelectedProduct(product){
    this.selectedProduct = product;
  }

  getSelectedProduct(){
    return this.selectedProduct;
  }

}
