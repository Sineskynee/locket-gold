const mapping = {
  '%E8%BD%A6%E7%A5%A8%E7%A5%A8': ['vip+watch_vip'],
  'Locket': ['Gold']
};

var ua = $request.headers["User-Agent"] || $request.headers["user-agent"],
    obj = JSON.parse($response.body);
var currentDate = new Date();
var billingDate = currentDate.toISOString().split('.')[0] + 'Z';
var expiresDateObj = new Date();
expiresDateObj.setFullYear(expiresDateObj.getFullYear() + 1);
var expiresDate = expiresDateObj.toISOString().split('.')[0] + 'Z';

obj.Attention = "Địt mẹ locket";

var locketSubscription = {
  is_sandbox: false,
  ownership_type: "PURCHASED",
  billing_issues_detected_at: null,
  period_type: "normal",
  expires_date: expiresDate,
  grace_period_expires_date: null,
  unsubscribe_detected_at: null,
  original_purchase_date: billingDate,
  purchase_date: billingDate,
  store: "app_store"
};

var locketEntitlement = {
  grace_period_expires_date: null,
  purchase_date: billingDate,
  product_identifier: "com.locket02.premium.yearly",
  expires_date: expiresDate
};

const match = Object.keys(mapping).find(e => ua.includes(e));
if (match) {
  let [entitlementKey, subscriptionKey] = mapping[match];
  if (subscriptionKey) {
    locketEntitlement.product_identifier = subscriptionKey;
    obj.subscriber.subscriptions[subscriptionKey] = locketSubscription;
  } else {
    obj.subscriber.subscriptions["com.locket02.premium.yearly"] = locketSubscription;
  }
  obj.subscriber.entitlements[entitlementKey] = locketEntitlement;
} else {
  obj.subscriber.subscriptions["com.locket02.premium.yearly"] = locketSubscription;
  obj.subscriber.entitlements.pro = locketEntitlement;
}

if (!obj.subscriber.entitlements) obj.subscriber.entitlements = {};
if (!obj.subscriber.subscriptions) obj.subscriber.subscriptions = {};

$done({body: JSON.stringify(obj)});
