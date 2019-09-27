import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  selectedProduct;
  favoriteProducts = [];

  constructor(){}

  setSelectedProduct(product){
    this.selectedProduct = product;
  }

  getSelectedProduct(){
    return this.selectedProduct;
  }

  addFavorite(product) {
    this.favoriteProducts.push(product);
    product.favorite = true;
    console.log("Los favoritos son: ", this.favoriteProducts);
  }

  removeFavorite(product) {
    product.favorite = false;
    this.favoriteProducts.map((currElement, index) => {
      if(currElement.id == product.id){
        this.favoriteProducts.splice(index,1);
      }
    });
    console.log("Los favoritos son: ", this.favoriteProducts);
  }

  getFavorites() {
    return this.favoriteProducts;
  }
}
