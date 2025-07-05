import { LightningElement, track, wire } from 'lwc';
import getComplaints from '@salesforce/apex/complaintController.getComplaints';

export default class ComplaintList extends LightningElement {
    @track fieldToBeSorted;
    @track sortDirection;
    @track complaints = [];
    hasComplaints;

    @track columns = [
        { label: 'Subject', fieldName: 'Subject__c', sortable: true },
        { label: 'Category', fieldName: 'Category__c', sortable: true },
        { label: 'SLA Deadline', fieldName: 'SLA_Deadline__c', type: 'dateTime', sortable: true },
        { label: 'Priority', fieldName: 'Priority__c' },
        { label: 'Status', fieldName: 'Status__c' }
    ];

    @wire(getComplaints)
    complaints({ data, error }) {
        if (data) {
            this.hasComplaints = true;
            this.complaints = data.map(item => ({
                Id: item.Id,
                Subject__c: item.Subject__c,
                Category__c: item.Category__c,
                SLA_Deadline__c: item.SLA_Deadline__c,
                Priority__c: item.Priority__c,
                Status__c: item.Status__c
            }))
        }
        else if (error) {
            console.log('error', error);
            this.hasComplaints = false;
        }
    }

    handleSorting(event) {
        const { fieldName, sortDirection } = event.detail;
        const cloneData = [...this.complaints];

        cloneData.sort((a, b) => {
            let one = a[fieldName];
            let two = b[fieldName];

            if (one > two) return sortDirection == 'asc' ? 1 : -1;
            if (one < two) return sortDirection == 'asc' ? -1 : 1;
            return 0;
        })
        this.complaints = cloneData;
        this.sortDirection = sortDirection;
        this.fieldToBeSorted = fieldName;
    }
}