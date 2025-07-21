public class placeOrderController {
    @Auraenabled
    public static void createOrder(List<LineItemWrapper> orderDetails, Decimal calculateTotal){
        Sales_Order__c newOrder = new Sales_Order__c();
        newOrder.Order_Date__c = System.today();
        newOrder.Status__c = 'Draft';
        newOrder.OwnerId = userInfo.getUserId();
        insert newOrder;
        createOrderLineItems(orderDetails, newOrder, calculateTotal);
    }
    
    public static void createOrderLineItems(List<LineItemWrapper> orderDetails, Sales_Order__c order, Decimal calculateTotal) {
        for(LineItemWrapper liw : orderDetails) {
            Order_Item__c newOrderItem = new Order_Item__c();
        	newOrderItem.Product_Name__c = liw.productName;
            newOrderItem.Quantity__c = liw.quantity;
            newOrderItem.Unit_Price__c = liw.unitPrice;
            newOrderItem.Total_Price__c = liw.total;
            newOrderItem.Sales_Order__c = order.Id;
        }
        order.Total_Amount__c = calculateTotal;
        update order;
    }
    
    public class LineItemWrapper {
        public String productName;
        public Integer quantity;
        public Decimal unitPrice;
        public Decimal total;
    }
}