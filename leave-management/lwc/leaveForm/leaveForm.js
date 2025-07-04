import { LightningElement, track, wire } from 'lwc';
import createLeaveRequest from '@salesforce/apex/LeaveFormController.createLeaveRequest';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import LeaveRequestObject from '@salesforce/schema/Leave_Request__c';
import LeaveTypeField from '@salesforce/schema/Leave_Request__c.Leave_Type__c';

export default class LeaveForm extends LightningElement {
    @track leaveType;
    @track startDate;
    @track endDate;
    @track reason;
    @track leaveTypeOptions;

    @wire(getObjectInfo, { objectApiName: LeaveRequestObject })
    leaveRequestObjectInfo({ data, error }) {
        if (data) {
            console.log('Object', data);
        }
        else if (error) {
            console.log(error);
        }
    };

    @wire(getPicklistValues, {
        fieldApiName: LeaveTypeField,
        recordTypeId: '012000000000000AAA'
    })
    leaveTypeOptions({ data, error }) {
        if (data) {
            console.log('Picklist values', data);
            this.leaveTypeOptions = data.values.map(item => ({
                label: item.label,
                value: item.value
            }));
            console.log('Leave Type Options', this.leaveTypeOptions);
        }
        else if (error) {
            console.log(error);
        }
    };

    // leaveTypeOptions = [
    //     {label: 'Casual Leave', value: 'Casual Leave'},
    //     {label: 'Emergency Leave', value: 'Emergency Leave'},
    //     {label: 'Paid Leave', value: 'Paid Leave'},
    //     {label: 'Sick Leave', value: 'Sick Leave'}
    // ]

    handleChange(event) {
        const field = event.target.name;
        this[field] = event.target.value;
    }

    handleSubmit() {
        createLeaveRequest({
            leaveType: this.leaveType,
            startDate: this.startDate,
            endDate: this.endDate,
            reason: this.reason
        })
            .then(() => {
                alert('Leave Request Submitted');
                this.leaveType = '';
                this.startDate = '';
                this.endDate = '';
                this.reason = '';
            })
            .catch(error =>
                alert('Failed to Submit ', error.body.message));
    }
}