import { LightningElement, track, wire } from 'lwc';
import getMyLeavesApex from '@salesforce/apex/LeaveFormController.getMyLeaves';

export default class LeaveList extends LightningElement {
    @track leaves = [];
    @track fieldToBeSorted;
    @track sortDirection;
    hasRecords

    @track columns = [
        { label: 'Leave Type', fieldName: 'Leave_Type__c', sortable: true },
        { label: 'Start Date', fieldName: 'Start_Date__c', type: 'date', sortable: true },
        { label: 'End Date', fieldName: 'End_Date__c', type: 'date', sortable: true },
        { label: 'Reason', fieldName: 'Reason__c' },
        { label: 'Status', fieldName: 'Approval_Status__c' }
    ];

    @wire(getMyLeavesApex)
    leaves({ data, error }) {
        if (data) {
            this.hasRecords = true;
            this.leaves = data.map(item => ({
                id: item.Id,
                Leave_Type__c: item.Leave_type__c,
                Start_Date__c: item.Start_date__c,
                End_Date__c: item.End_date__c,
                Reason__c: item.Reason__c,
                Approval_Status__c: item.Approval_status__c
            }));
            console.log('data', data);
            console.log('Leaves', this.leaves);
        }
        else if (error) {
            console.log(error);
        }
    }

    handleSorting(event) {
        const { fieldName, sortDirection } = event.detail;

        let sortedData = [...this.leaves];

        sortedData.sort((a, b) => {
            let valA = a[fieldName] || '';
            let valB = b[fieldName] || '';

            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            return 0;
        });

        this.leaves = sortedData;
        this.sortDirection = sortDirection;
        this.fieldToBeSorted = fieldName;
    }


}