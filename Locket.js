var request = $request;

// Lấy thời gian hiện tại
const now = new Date();
const nowISO = now.toISOString();
const nowMs = now.getTime();

const options = {
    url: "https://api.revenuecat.com/v1/product_entitlement_mapping",
    headers: {
      'Authorization': request.headers["authorization"],
      'X-Platform': 'iOS',
      'User-Agent': request.headers["user-agent"]
    }
};

$httpClient.get(options, function(error, newResponse, data) {

  const ent = JSON.parse(data);

  // Sửa các ngày trong jsonToUpdate thành ngày hôm nay
  let jsonToUpdate = {
    "request_date_ms": nowMs,
    "request_date": nowISO,
    "subscriber": {
      "entitlement": {},
      "first_seen": nowISO,
      "original_application_version": "9692",
      "last_seen": nowISO,
      "other_purchases": {},
      "management_url": null,
      "subscriptions": {},
      "entitlements": {},
      "original_purchase_date": nowISO,
      "original_app_user_id": "70B24288-83C4-4035-B001-573285B21AE2",
      "non_subscriptions": {}
    }
  };

  const productEntitlementMapping = ent.product_entitlement_mapping;

  for (const [entitlementId, productInfo] of Object.entries(productEntitlementMapping)) {
    const productIdentifier = productInfo.product_identifier;
    const entitlements = productInfo.entitlements;

    for (const entitlement of entitlements) {
      jsonToUpdate.subscriber.entitlements[entitlement] = {
        "purchase_date": nowISO,
        "original_purchase_date": nowISO,
        "expires_date": "9692-01-01T01:01:01Z",  // Thời hạn vẫn giữ như cũ
        "is_sandbox": false,
        "ownership_type": "PURCHASED",
        "store": "app_store",
        "product_identifier": productIdentifier
      };

      // Thêm product identifier vào subscriptions
      jsonToUpdate.subscriber.subscriptions[productIdentifier] = {
        "expires_date": "9692-01-01T01:01:01Z",  // Thời hạn vẫn giữ như cũ
        "original_purchase_date": nowISO,
        "purchase_date": nowISO,
        "is_sandbox": false,
        "ownership_type": "PURCHASED",
        "store": "app_store"
      };
    }
  }

  body = JSON.stringify(jsonToUpdate);
  $done({body});
});
