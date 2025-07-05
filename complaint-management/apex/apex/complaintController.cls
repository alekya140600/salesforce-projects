public class complaintController {
    
    @AuraEnabled
    public static void createComplaint(String subject, String description, String category, String priority){
        try {
            Complaint__c newComplaint = new Complaint__c();
            newComplaint.Status__c = 'New';
            newComplaint.Created_By__c = UserInfo.getUserId();
            newComplaint.Category__c = category;
            newComplaint.Subject__c = subject;
            newComplaint.Description__c = description;
            newComplaint.Priority__c = priority;
            
            if(priority == 'Low') newComplaint.SLA_Deadline__c = System.now().addHours(72);
            if(priority == 'Medium') newComplaint.SLA_Deadline__c = System.now().addHours(72);
            if(priority == 'High') newComplaint.SLA_Deadline__c = System.now().addHours(72);
            
            insert newComplaint;
        }
        catch(Exception e) {
            throw new AuraHandledException(e.getMessage() + 'at' + e.getLineNumber());
        }
        
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Complaint__c> getComplaints() {
        List<Complaint__c> result = new List<Complaint__c>();
        result = [Select Id, Subject__c, Category__c, SLA_Deadline__c, Priority__c, Status__c 
                  From complaint__c
                  Where Created_By__c =: UserInfo.getUserId()];
        return result;
    }
}