const mapping = {
  '%E8%BD%A6%E7%A5%A8%E7%A5%A8': ['vip+watch_vip'],
  'Locket': ['Gold']
};

var ua = $request.headers["User-Agent"] || $request.headers["user-agent"],
    obj = JSON.parse($response.body);

// Set billing date to today's date
var currentDate = new Date();
var billingDate = currentDate.toISOString().split('.')[0] + 'Z';

// Set expires date to one month from billing date
var expiresDateObj = new Date();
expiresDateObj.setMonth(expiresDateObj.getMonth() + 1);
var expiresDate = expiresDateObj.toISOString().split('.')[0] + 'Z';

// Message
obj.Attention = "Chúc mừng bạn! Vui lòng không bán hoặc chia sẻ cho người khác!";

var locket02 = {
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

var locket01 = {
  grace_period_expires_date: null,
  purchase_date: billingDate,
  product_identifier: "com.locket02.premium.yearly",
  expires_date: expiresDate
};

const match = Object.keys(mapping).find(e => ua.includes(e));
if (match) {
  let [e, s] = mapping[match];
  s ? (locket01.product_identifier = s, obj.subscriber.subscriptions[s] = locket02) 
    : obj.subscriber.subscriptions["com.locket02.premium.yearly"] = locket02;
  obj.subscriber.entitlements[e] = locket01;
} else {
  obj.subscriber.subscriptions["com.locket02.premium.yearly"] = locket02;
  obj.subscriber.entitlements.pro = locket01;
}

$done({body: JSON.stringify(obj)});
