global class SLAEscalationBatch implements Database.Batchable<SObject> {
    User manager = [Select Id, Email From User Where Name = 'Alekya Rapeti'limit 1];
    String email = manager.Email;
    List<Complaint__c> comsToUpdate = new List<Complaint__c>();
    public Database.queryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator([Select Id, Subject__c, Escalated_To__c, SLA_Deadline__c 
                                         From Complaint__c
                                         Where SLA_Deadline__c < :System.now() 
                                         And (Status__c != 'Escalated' OR Status__c != 'Resolved')]);
    }
    
    global void execute(Database.BatchableContext bc, List<Complaint__c> scope) {
        for(Complaint__c com : scope) {
            com.Escalated_To__c = manager.Id;
            com.Status__c = 'Escalated';
            comsToUpdate.add(com);
        }
        if(!comsToUpdate.isEmpty()){
            update comsToUpdate;
        }
    }
    
    global void finish(Database.BatchableContext BatchableContext) {
        for(Complaint__c com : comsToUpdate) {
            Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
            mail.toAddresses = new String[]{email};
            mail.setSubject('A complaint has been escalated');
            String body = 'Hello, <br/><br/>';
            body += 'The following complaint has been escalated: <br/>';
            body += '<b>' + 'Complaint Subject: ' + '</b>' + ':' + com.Subject__c + '<br/>';
            mail.setHtmlBody(body);
            Messaging.SingleEmailMessage[] messages = new Messaging.SingleEmailMessage[]{mail};
            Messaging.sendEmail(messages);
        }
    }
}