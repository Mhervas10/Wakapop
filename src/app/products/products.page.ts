import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LoadingController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

import { Product } from '../models/product';
import { ProductsService } from '../services/products.service';
import { VirtualTimeScheduler } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {

  products: Product[] = [];
  searchTerm : string = "";
  searchededItems: Product[];
  showing: string = "products";
  selectedItems = [];
  filteredItems = [];
  status: string = 'products';

  knobValues: any = {
    upper:0,
    lower:200
  }

  filters = [
    {
      value:"Zapatillas",
      isChecked:false
    },{
      value:"Deportes",
      isChecked:false
    }
  ];

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

  setSearchedItems() {
    console.log("Searching term: ", this.searchTerm);
    this.searchededItems = this.searchItems(this.searchTerm);
    if(this.searchededItems.length > 0) {
      this.status = 'search';
    }
    else {
      this.status = 'products';
    }
  }

  searchItems(searchTerm){
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

  checkboxClicked(filterClicked){
    console.log("Filters BEFORE toggle: ", this.filters);
    filterClicked.isChecked = !filterClicked.isChecked;
    console.log("Filters AFTER toggle: ", this.filters);

    // Get filtered Products
    this.filteredItems = [];
    //Search activated checkboxs
    this.filters.map((filter) => {
      if(filter.isChecked) {
        // Add products to filteredItems array
        let productsFound = this.products.filter((product) => {
             return product.category.toLowerCase() == filter.value.toLowerCase();
         });
         this.filteredItems.push(...productsFound);
      }
    });
    // Update page status
    console.log(this.filteredItems);
    if(this.filteredItems.length > 0) {
      this.status = "filter";
    }
    else {
      this.status = 'products';
    }
  }
}


