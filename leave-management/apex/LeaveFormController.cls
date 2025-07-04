public class LeaveFormController {
    
    @AuraEnabled
    public static void createLeaveRequest(String leaveType, Date startDate, Date endDate, String reason) {
        try {
            Leave_Request__c newRequest = new Leave_Request__c();
            newRequest.Leave_type__c = leaveType;
            newRequest.Start_date__c = startDate;
            newRequest.End_date__c = endDate;
            newRequest.Reason__c = reason;
            newRequest.Approval_status__c = 'Submitted for approval';
            newRequest.Employee__c = UserInfo.getUserId();
            insert newRequest;
        }
        catch(Exception e) {
            System.debug(e);
        }
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Leave_Request__c> getMyLeaves() {
        String currentUserId = UserInfo.getUserId();
        List<Leave_Request__c> myLeaves = new List<Leave_Request__c>();
        myLeaves = [Select Id, Leave_Type__c, Start_Date__c, End_Date__c, Reason__c, Approval_Status__c 
                    From 
                    	Leave_Request__c
                    Where Employee__c =: currentUserId ];
        System.debug(myLeaves);
        return myLeaves;
    }
}