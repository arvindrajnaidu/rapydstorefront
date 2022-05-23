const fetch = require('axios')
const functions = require('firebase-functions')
const moment = require('moment')

const {
    postmates,
} = functions.config()

const { getToday } = require('../lib/clock')

const getQuote = async (customerAddress, merchantAddress) => {
    console.log('Getting Quote for ', customerAddress, merchantAddress)
    const resp = await fetch(`https://api.postmates.com/v1/customers/${postmates.customer_id}/delivery_quotes`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${postmates.auth_basic}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `dropoff_address=${customerAddress}&pickup_address=${merchantAddress}`
    })
    const json = resp.json()
    return json
}

const executeDelivery = async (admin, slug, orderId, pickupInMinutes = 30) => {
    console.log('Dispatching delivery for order ', orderId, slug)
    const TODAY = getToday()

    const profileSnap = await admin.database().ref(`/merchants/${slug}/profile`).once('value')
    const profile = profileSnap.val()

    const orderSnap = await admin.database().ref(`/merchants/${slug}/online_orders/${TODAY}/${orderId}`).once('value')
    const order = orderSnap.val()

    if (!order.delivery || !order.delivery.address) {
        return null
    }

    const fest = order.lineItems.reduce((prev, curr) => {
        if (curr.timeIn) {
            // Delivery Fees, Taxes and Tips don not have a time-in
            prev.manifest.push(`${curr.name} x ${curr.quantity}`)
            prev.manifest_items.push({
                name: curr.name,
                quantity: curr.quantity,
                size: 'small'
            })    
        }
        return prev
    }, {manifest: [], manifest_items: []})

    console.log(fest)

    const customerPhone = order.phoneNumber.split('@')[0]
    
    const pickupReadyAt = moment().add(pickupInMinutes, 'minutes').format()
    const fetchParams = [
        `dropoff_address=${encodeURIComponent(order.delivery.address)}`,
        `dropoff_name=${encodeURIComponent(order.title)}`,
        `dropoff_phone_number=${encodeURIComponent(customerPhone)}`,
        `pickup_address=${encodeURIComponent(profile.address)}`,
        `pickup_name=${encodeURIComponent(profile.name)}`,
        `pickup_phone_number=${encodeURIComponent(profile.phoneNumber)}`,
        `quote_id=${encodeURIComponent(order.delivery.quote.id)}`,
        `pickup_ready_dt=${encodeURIComponent(pickupReadyAt)}`,        
        `manifest=${encodeURIComponent(fest.manifest.join(','))}`,
        `manifest_items=${encodeURIComponent(JSON.stringify(fest.manifest_items))}`,
    ]

    const confBody = fetchParams.join('&')

    console.log('Confirmation payload', confBody)
    const resp = await fetch(`https://api.postmates.com/v1/customers/${postmates.customer_id}/deliveries`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${postmates.auth_basic}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: confBody
    })
    const json = await resp.json()
    console.log(JSON.stringify(json))

    const resultRef = admin.database().ref(`/merchants/${slug}/online_orders/${TODAY}/${orderId}/delivery`).child('result')
    await resultRef.set(json)

    return json
}

module.exports = {
    getQuote,
    executeDelivery,
}
