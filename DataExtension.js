sap.ui.define(["sap/ui/integration/Extension"], function (Extension) {
    "use strict";

    var DataExtension = Extension.extend("com.example.card.GenericDataExtension");

    DataExtension.prototype.getData = function (filterField1, filterField2) {
        var card = this.getCard();
        
        var filters = [];
        if (filterField1 && filterField1 !== "All Options") {
            filters.push("contains(Field1,'" + filterField1 + "')");
        }
        if (filterField2 && filterField2 !== "All Options") {
            filters.push("contains(Field2,'" + filterField2 + "')");
        }
        
        var filterQuery = filters.length ? "$filter=" + filters.join(" and ") : "";

        return card.request({
            "url": "{{destinations.GenericAPI}}/odata/v4/resource/Items?" + filterQuery,
            "method": "GET",
            "withCredentials": false
        }).then(function (data) {
            return data.value.map(function (item) {
                return {
                    "ID": item.ID,
                    "Type": item.Type,
                    "Description": item.Description,
                    "Group": item.Group,
                    "Field1": item.Field1,
                    "Field2": item.Field2,
                    "DeliveryInfo": item.DeliveryInfo,
                    "Unit": item.Unit,
                    "CategoryMain": item.CategoryMain,
                    "CategorySub1": item.CategorySub1,
                    "CategorySub2": item.CategorySub2,
                    "Category": item.Category
                };
            });
        });
    };

    DataExtension.prototype.getDataField1 = function () {
        var card = this.getCard();

        return card.request({
            "url": "{{destinations.GenericAPI}}/odata/v4/resource/Items?$select=Field1&$orderby=Field1&$top=1000",
            "method": "GET",
            "withCredentials": false
        }).then(function (data) {
            var uniqueField1Options = {};
            data.value.forEach(function (item) {
                if (item.Field1) {
                    uniqueField1Options[item.Field1] = true;
                }
            });
            var uniqueField1List = [{ "Field1": "All Options" }].concat(
                Object.keys(uniqueField1Options).map(function (name) {
                    return { "Field1": name };
                })
            );

            return { "Field1Options": uniqueField1List };
        });
    };

    DataExtension.prototype.getDataField2 = function () {
        var card = this.getCard();

        return card.request({
            "url": "{{destinations.GenericAPI}}/odata/v4/resource/Items?$select=Field2&$orderby=Field2&$top=1000",
            "method": "GET",
            "withCredentials": false
        }).then(function (data) {
            var uniqueField2Options = {};
            data.value.forEach(function (item) {
                if (item.Field2) {
                    uniqueField2Options[item.Field2] = true;
                }
            });
            var uniqueField2List = [{ "Field2": "All Options" }].concat(
                Object.keys(uniqueField2Options).map(function (description) {
                    return { "Field2": description };
                })
            );

            return { "Field2Options": uniqueField2List };
        });
    };

    return DataExtension;
});
