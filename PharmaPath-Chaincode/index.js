/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const PharmaContract = require('./lib/pharma-contract');
const OrderContract = require('./lib/order-contract');


module.exports.PharmaContract = PharmaContract;
module.exports.OrderContract = OrderContract;

module.exports.contracts = [ PharmaContract,OrderContract];