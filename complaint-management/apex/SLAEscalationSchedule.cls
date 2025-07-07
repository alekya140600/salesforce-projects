public class SLAEscalationSchedule implements Schedulable {
    public void execute(SchedulableContext SC) {
        SLAEscalationBatch seb = new SLAEscalationBatch();
        Database.executeBatch(seb, 200);
    }
}