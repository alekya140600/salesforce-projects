import { LightningElement, track, wire } from 'lwc';
import createComplaintApex from '@salesforce/apex/complaintController.createComplaint';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import PriorityField from '@salesforce/schema/Complaint__c.Priority__c';
import CategoryField from '@salesforce/schema/Complaint__c.Category__c';
import ComplaintObject from '@salesforce/schema/Complaint__c';

export default class ComplaintForm extends LightningElement {
    @track subject;
    @track description;
    @track category;
    @track priority;
    @track categories;
    @track priorities;

    @wire(getObjectInfo, { objectApiName: ComplaintObject })
    objectInfo;

    @wire(getPicklistValues, {
        recordTypeId: '012000000000000AAA',
        fieldApiName: CategoryField
    })
    categories({ data, error }) {
        if (data) {
            this.categories = data.values.map(category => ({
                label: category.label,
                value: category.value
            }));
        }
        if (error) {
            console.log(error);
        }
    };

    @wire(getPicklistValues, {
        recordTypeId: '012000000000000AAA',
        fieldApiName: PriorityField
    })
    priorities({ data, error }) {
        if (data) {
            this.priorities = data.values.map(priority => ({
                label: priority.label,
                value: priority.value
            }));
        }
        if (error) {
            console.log(error);
        }
    };

    handleInputChange(event) {
        const field = event.target.name;
        this[field] = event.target.value;
    }

    handleSubmit() {
        createComplaintApex({
            subject: this.subject,
            description: this.description,
            category: this.category,
            priority: this.priority
        })
            .then(() => {
                alert('Complaint Submitted');
                this.subject = '';
                this.description = '';
                this.category = '';
                this.priority = '';
            })
            .catch(error => {
                alert('Error: ' + error.body.message);
            });
    }
}