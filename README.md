# UI-Integation-Card
How to Consume Custom API Data and Display it in a SAP UI Integration Card

SAP UI Integration Cards provide a seamless way to display data from external sources within your UI5 applications. These versatile cards can be utilized across various platforms, including #SAP Build Work Zone, advanced edition, #SAP Fiori Launchpad #, and #SAP Business Application Studio #, allowing users to gain valuable business insights and interact with data in real-time.

In this blog, I'll walk you through the process step-by-step. We’ll start by defining the card configuration, then set up filters to refine the displayed data. Next, we’ll explore custom data fetching techniques, and finally, I’ll show you how to present the data effectively within the card. Each section will include clear explanations to ensure you can easily follow along and implement these concepts in your own projects.

Defining the Card in manifest.json
The manifest.json file is the backbone of the card configuration. Here, we define basic card information such as the title, description, and the type of card.

{
  "sap.app": {
    "id": "com.example.card.CustomCatalogItemList",
    "type": "card",
    "title": "Material List Overview",
    "subTitle": "Filter and View Material Data",
    "description": "A detailed view of catalog items, including item description, manufacturer, delivery time, and category."
  }
}
Explanation:

ID: Uniquely identifies the card.
Title/SubTitle: Describes the content and purpose of the card.
Description: A detailed explanation of what data the card displays.
Setting Up Filters in the Card
Filters allow users to customize their view by narrowing down the data shown in the card. In this example, we provide filters for ManufacturerName and ItemDescription.

"filters": {
  "ManufacturerName": {
    "type": "Select",
    "label": "Manufacturer Name",
    "data": { "extension": { "method": "getDataManufacturerName" } }
  },
  "ItemDescription": {
    "type": "Select",
    "label": "Material Name",
    "data": { "extension": { "method": "getDataItemDescription" } }
  }
}
Explanation:

Filter Types: Both filters are of type Select, allowing users to choose from a list of manufacturers or item descriptions.
Data Binding: The data for these filters is fetched using methods defined in the DataExtension.js file (discussed later).

Custom Data Fetching with DataExtension.js
The actual data fetching from an external API is handled in DataExtension.js. This JavaScript file contains logic to retrieve filtered data from the API and bind it to the card.

DataExtension.prototype.getData = function (ManufacturerName, ItemDescription) {
    var filters = [];
    if (ManufacturerName && ManufacturerName !== "All Manufacturers") {
        filters.push("contains(ManufacturerName,'" + ManufacturerName + "')");
    }
    if (ItemDescription && ItemDescription !== "All Materials") {
        filters.push("contains(ItemDescription,'" + ItemDescription + "')");
    }
    
    var filterQuery = filters.length ? "$filter=" + filters.join(" and ") : "";

    return this.getCard().request({
        "url": "{{destinations.Custom_API_Destination}}/odata/v4/catalog/CatalogItems?" + filterQuery,
        "method": "GET"
    }).then(function (data) {
        return data.value.map(function (item) {
            return {
                "ItemID": item.ItemID,
                "ItemDescription": item.ItemDescription,
                "ManufacturerName": item.ManufacturerName,
                "DeliveryTime": item.DeliveryTime,
                "Category": item.Category
            };
        });
    });
};
Explanation:

Filters: The code dynamically constructs a filter query based on user input (selected manufacturer and item description).
API Request: It sends a GET request to the custom API, fetching the filtered list of catalog items.
Data Mapping: The retrieved data is mapped to relevant fields like ItemID, ItemDescription, and ManufacturerName, which are then displayed in the card.

Fetching Filter Data for Manufacturer and Item Description
In addition to fetching the catalog items, we need to retrieve the unique manufacturers and item descriptions for the filter dropdowns.

Code for Manufacturer Filter:

DataExtension.prototype.getDataManufacturerName = function () {
    return this.getCard().request({
        "url": "{{destinations.Custom_API_Destination}}/odata/v4/catalog/CatalogItems?$select=ManufacturerName",
        "method": "GET"
    }).then(function (data) {
        var uniqueManufacturers = {};
        data.value.forEach(function (item) {
            uniqueManufacturers[item.ManufacturerName] = true;
        });
        return { "ManufacturerNames": Object.keys(uniqueManufacturers).map(name => ({ "ManufacturerName": name })) };
    });
};
Explanation:

API Call: This method fetches the distinct list of manufacturers from the API.
Mapping Data: Unique manufacturer names are mapped and returned to be displayed in the dropdown.
Code for Item Description Filter:

DataExtension.prototype.getDataItemDescription = function () {
    return this.getCard().request({
        "url": "{{destinations.Custom_API_Destination}}/odata/v4/catalog/CatalogItems?$select=ItemDescription",
        "method": "GET"
    }).then(function (data) {
        var uniqueDescriptions = {};
        data.value.forEach(function (item) {
            uniqueDescriptions[item.ItemDescription] = true;
        });
        return { "ItemDescriptions": Object.keys(uniqueDescriptions).map(description => ({ "ItemDescription": description })) };
    });
};
Explanation:

Similar Logic: This method works similarly to the manufacturer filter, but fetches unique item descriptions for the dropdown filter.

Displaying Data in the Card
Once the data is fetched from the API, it is displayed in the card’s table. The content section in manifest.json binds this data to the UI elements.

"content": {
  "maxItems": 6,
  "row": {
    "columns": [
      { "title": "Material Name", "value": "{ItemDescription}" },
      { "title": "Manufacturer", "value": "{ManufacturerName}" },
      { "title": "Delivery Time", "value": "{DeliveryTime}{UnitOfMeasure}" },
      { "title": "Category", "value": "{Category}" }
    ]
  }
}
Explanation:

Data Binding: The placeholders ({ItemDescription}, {ManufacturerName}, etc.) are dynamically replaced by the values fetched from the API.
Columns: The card displays columns for material name, manufacturer, delivery time, and category.
Pagination: Only 6 items are displayed per page.




Conclusion
In conclusion, breaking the code into manageable sections highlights how SAP UI Integration Cards provide a flexible and robust method for consuming external API data and presenting it in a user-friendly manner. Utilizing manifest.json for configuration and DataExtension.js for API requests allows for seamless integration of any external data source into your SAP UI5 applications. This approach is particularly useful for consuming OData or any API calls within your UI Integration Cards, enabling you to manipulate data effectively for your specific use case.
