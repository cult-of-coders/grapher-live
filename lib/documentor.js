import {LinkConstants, NamedQueryStore} from 'meteor/cultofcoders:grapher';
import deepClone from 'lodash.clonedeep';

export default function extract() {
    return {
        namedQueries: extractNamedQueryDocumentation(),
        collections: extractCollectionDocumentation()
    }
};

function extractNamedQueryDocumentation() {
    const namedQueries = NamedQueryStore.getAll();

    let DocumentationObject = {};

    _.each(namedQueries, namedQuery => {
        if (!namedQuery.collection) {
            return; 
        }
        
        DocumentationObject[namedQuery.queryName] = {
            body: namedQuery.body,
            collection: namedQuery.collection._name,
            isExposed: namedQuery.isExposed,
        };
    });

    return DocumentationObject;
}

function extractCollectionDocumentation() {
    const collections = Mongo.Collection.getAll();
    let DocumentationObject = {};

    _.each(collections, ({name, instance}) => {
        if (name === null) {
            return;
        }

        if (name.substr(0, 7) == 'meteor_') {
            return;
        }

        DocumentationObject[name] = {};
        var isExposed = !!instance.__isExposedForGrapher;
        DocumentationObject[name]['isExposed'] = isExposed;

        if (isExposed && instance.__exposure.config.body) {
            DocumentationObject[name]['exposureBody'] = deepClone(instance.__exposure.config.body);
        }

        extractSchema(DocumentationObject[name], instance);
        extractLinks(DocumentationObject[name], instance);
        extractReducers(DocumentationObject[name], instance);
    });

    return DocumentationObject;
}


function extractSchema(storage, collection) {
    storage.schema = {};

    if (collection.simpleSchema && collection.simpleSchema()) {
        storage.schema = deepClone(collection.simpleSchema()._schema);

        formatSchemaType(storage.schema);
    }
}

function extractReducers(storage, collection) {
    storage.reducers = {};

    if (collection.__reducers) {
        _.each(collection.__reducers, (value, key) => {
            storage.reducers[key] = {
                body: deepClone(value.body)
            }
        })
    }
}

function formatSchemaType(schema) {
    _.each(schema, (value, key) => {
        if (value.type && value.type.name) {
            value.type = value.type.name;
        }
        if (value.type && value.type.definitions) {
            value.type = value.type.definitions[0].type.name;
        }
    });

    return schema;
}

function extractLinks(storage, collection) {
    storage.links = {};
    const collectionLinkStorage = collection[LinkConstants.LINK_STORAGE];

    _.each(collectionLinkStorage, (linker, name) => {
        storage.links[name] = {
            collection: linker.getLinkedCollection()._name,
            strategy: linker.strategy,
            metadata: linker.linkConfig.metadata,
            isVirtual: linker.isVirtual(),
            inversedBy: linker.linkConfig.inversedBy,
            isOneResult: linker.isOneResult(),
            linkStorageField: linker.linkStorageField
        }
    })
}