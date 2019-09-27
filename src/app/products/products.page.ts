import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LoadingController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

import { Product } from '../models/product';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {

  products: Product[] = [];
  searchTerm : string = "";
  filteredItems: Product[];
  showing: string = "products";

  knobValues: any = {
    upper:0,
    lower:200
  }

  constructor(
    public loadingCtrl: LoadingController,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private productsService: ProductsService
  ) { }

  ngOnInit() {
    if (this.route && this.route.data) {
      this.getData();
    }
  }

  async getData(){
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    this.presentLoading(loading);

    this.route.data.subscribe(routeData => {
      routeData['data'].subscribe(data => {
        loading.dismiss();
        // Clean firebase data
        data.map((currElement, index) => {
          this.products[index] = currElement.payload.doc.data();
          this.products[index].id = currElement.payload.doc.id;
        });
        console.log("Products loaded in products.page: ", this.products);
      })
    })
  }

  async presentLoading(loading) {
    return await loading.present();
  }

  logout(){
    this.authService.doLogout()
    .then(res => {
      this.router.navigate(["/login"]);
    }, err => {
      console.log(err);
    })
  }

  setFilteredItems() {
    console.log("Searching term: ", this.searchTerm);
    this.filteredItems = this.filterItems(this.searchTerm);
  }

  filterItems(searchTerm){
    return this.products.filter((item) => {
      let title = item.title;
         return title.toLowerCase().includes(searchTerm.toLowerCase());
     });
 }

  goToDetail(product){
    this.productsService.setSelectedProduct(product);
    this.router.navigate(["/details"]);
  }

  toggleFavorite(product) {
    if(product.favorite && product.favorite == true) {
      this.productsService.removeFavorite(product);
    }
    else{
      this.productsService.addFavorite(product);
    }
  }

}
