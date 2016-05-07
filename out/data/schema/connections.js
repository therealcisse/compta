'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.connectionDefinition = connectionDefinition;

var _graphqlRelay = require('graphql-relay');

var _graphql = require('graphql');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }
/**
 *  Copyright (c) 2015, Epsilon, SARL.
 *  All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 */

/**
 * Constructs a GraphQL connection field config; it is assumed
 * that the object has a property named `prop`, and that property
 * contains a list of URLs.
 */
function connectionDefinition(name, type, dataFetcher) {
  var _connectionDefinition = (0, _graphqlRelay.connectionDefinitions)({
    name: name,
    nodeType: type,
    connectionFields: function connectionFields() {
      return {
        totalCount: {
          type: _graphql.GraphQLInt,
          resolve: function resolve(conn) {
            return conn.totalCount;
          },
          description: 'A count of the total number of objects in this connection, ignoring pagination.\nThis allows a client to fetch the first five objects by passing "5" as the\nargument to "first", then fetch the total count so it could display "5 of 83",\nfor example.'
        }

      };
    }
  });

  var connectionType = _connectionDefinition.connectionType;
  var edgeType = _connectionDefinition.edgeType;

  return {
    connection: {
      type: connectionType,
      args: _graphqlRelay.connectionArgs,
      resolve: function resolve(obj, args, info) {
        var _this = this;

        return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
          var array;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return dataFetcher(obj, info);

                case 2:
                  array = _context.sent;
                  return _context.abrupt('return', _extends({}, (0, _graphqlRelay.connectionFromArray)(array, args), {
                    totalCount: array.length
                  }));

                case 4:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, _this);
        }))();
      }
    },
    edgeType: edgeType
  };
}