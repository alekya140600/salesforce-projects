import { LightningElement, track } from 'lwc';
import createOrder from '@salesforce/apex/placeOrderController.createOrder';

export default class PlaceOrder extends LightningElement {
    @track productName;
    @track quantity;
    @track unitPrice;
    @track total;
    @track numberOfRows = [{ id: 1, productName: '', quantity: '', unitPrice: '', showTotal: false, total: '' }];
    calculateTotal = 0;

    get calculateTotal() {
        return this.calculateTotal?? 0;
    }

    handleChange(event) {
        for (let i = 0; i < this.numberOfRows.length; i++) {
            if (this.numberOfRows[i].id == event.target.dataset.id) {
                    this.numberOfRows[i][event.target.name] = event.target.value;
                    if (this.numberOfRows[i].quantity && this.numberOfRows[i].unitPrice) {
                        this.numberOfRows[i].showTotal = true
                        this.numberOfRows[i].total = this.numberOfRows[i].quantity * this.numberOfRows[i].unitPrice;
                        this.calculateTotal = this.calculateTotal + this.numberOfRows[i].total;
                    }
            }
        }
    }

        handleAddRow() {
            const newRow = { id: this.numberOfRows.length + 1, productName: '', quantity: '', unitPrice: '', showTotal: false, total: '' };
            this.numberOfRows.push(newRow);
        }

        handleSubmit() {
            createOrder({ order: this.numberOfRows, calculateTotal: this.calculateTotal })
            .then(result => {
                alert('Order Created Successfully');
            })
            .catch(error => {
                alert('Error in Order Creation', error.message, error.stack);
            })
        }
    }