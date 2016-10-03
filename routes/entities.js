'use strict';

var Boom = require('boom'),
    uuid = require('node-uuid'),
    Joi = require('joi');

exports.register = function (server, options, next) {

    var db = server.app.db;

    server.route({
        method: 'GET',
        path: '/entities',
        handler: function handler(request, reply) {

            db.entities.find({},{ _id: 0},function (err, docs) {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal Mongo Data Base error'));
                }

                reply(docs);
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/entities/{id}',
        handler: function handler(request, reply) {

            db.entities.findOne({
                _id: request.params.id
            },{ _id: 0}, function (err, doc) {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal Mongo Data Base error'));
                }

                if (!doc) {
                    return reply(Boom.notFound());
                }

                reply(doc);
            });
        }
    });

    server.route({
        method: 'POST',
        path: '/entities',
        handler: function handler(request, reply) {
            var entity = request.payload;
            entity.token = uuid.v4();
            entity._id = uuid.v1();

            db.entities.save(entity, function (err, result) {
                if (err) {
                    return reply(Boom.wrap(err, 'Internal Mongo Data Base error'));
                }
                reply(entity);
            });
        },
        config: {
            validate: {
                payload: {
                    application: Joi.string().min(3).max(50).required(),
                    name: Joi.string().min(3).max(50).required(),
                    access: Joi.object().keys({
                        apps: Joi.array().items(Joi.string()).min(1).unique(),
                        contexts: Joi.array().items(Joi.string()).min(1).unique(),
                        entity_types: Joi.string()
                    })
                }
            }
        }
    });

    server.route({
        method: 'PATCH',
        path: '/entities/{id}',
        handler: function handler(request, reply) {

            db.entities.update({
                _id: request.params.id
            }, {
                $set: request.payload
            }, function (err, result) {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal Mongo Data Base error'));
                }

                if (result.n === 0) {
                    return reply(Boom.notFound());
                }

                reply().code(204);
            });
        },
        config: {
            validate: {
                payload: Joi.object({
                    application: Joi.string().min(3).max(50).required(),
                    name: Joi.string().min(3).max(50).required(),
                    access: Joi.object().keys({
                        apps: Joi.array().items(Joi.string()).min(1).unique(),
                        contexts: Joi.array().items(Joi.string()).min(1).unique(),
                        entity_types: Joi.string()
                    })
                }).required().min(1)
            }
        }
    });

    server.route({
        method: 'DELETE',
        path: '/entities/{id}',
        handler: function handler(request, reply) {

            db.entities.remove({
                _id: request.params.id
            }, function (err, result) {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal Mongo Data Base error'));
                }

                if (result.n === 0) {
                    return reply(Boom.notFound());
                }

                reply().code(204);
            });
        }
    });

    return next();
};

exports.register.attributes = {
    name: 'routes-entities'
};