import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  freshnessList= ["Brand new", "second hand","refurbished"]

  productForm !: FormGroup;

  actionBtn: string = "Save"; 

  constructor(
    private formBuilder: FormBuilder,
     private api : ApiService, 
     private dialogRef : MatDialogRef<DialogComponent>,
     @Inject(MAT_DIALOG_DATA) public editData: any) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      freshness: ['', Validators.required],
      price: ['', Validators.required],
      comment: ['', Validators.required],
      date: ['', Validators.required]
    });

    console.log(this.editData);
    if(this.editData){
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['date'].setValue(this.editData.date);
      this.productForm.controls['freshness'].setValue(this.editData.freshness);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comment'].setValue(this.editData.comment);
      this.actionBtn= "Update";
    }
  }


  addProduct(){
     if(!this.editData){
      if(this.productForm.valid){
        this.api.postProduct(this.productForm.value)
        .subscribe({
          next:(res)=>{
            //success
            alert("Product added successfully");
            this.productForm.reset(); //içini boşalt
            this.dialogRef.close('save');
          },
          error:()=>{
            alert("error while adding the product");
          }
        });
      }
     }else{
        this.updateProduct();
      }
  }

  updateProduct(){
    //putProduct
    this.api.putProduct(this.productForm.value, this.editData.id)
    .subscribe({
      next:(res=>{
        alert("Product updated successfully");
        this.productForm.reset();
        this.dialogRef.close('update');
        
      }),
      error:()=>{
        alert("error while updating the product");
      }
    });
  }

  deleteProduct(){
    //deleteProduct
  }

}
