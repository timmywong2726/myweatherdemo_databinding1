require([
    "dojo/when",
    // http://dojotoolkit.org/reference-guide/1.10/dojox/mvc/getStateful.html
    "dojox/mvc/getStateful",
    // http://dojotoolkit.org/reference-guide/1.10/dojox/mvc/at.html
    "dojox/mvc/at",
    // https://dojotoolkit.org/reference-guide/1.10/dijit/registry.html
    "dijit/registry",
    "aps/ResourceStore",
    "aps/load",
    "aps/ready!"
], function(when, getStateful, at, registry, ResourceStore, load) {

    // preparing connector to APS controller, at this point no request is made
    var store = new ResourceStore({
        target: "/aps/2/resources/"
    });

    // to bind data to widgets model has to be a Stateful object
    var company = getStateful(aps.context.vars.subscription_service);

    var widgets =
        ["aps/PageContainer", [
            ["aps/Output", {
                id: "description",
                content: "Here you can update your company information.<br><br>To verify the changes log in to to <a href='http://www.myweatherdemo.com/login' target='_blank'>http://www.myweatherdemo.com/login</a> using username <b>${username}</b> and password <b>${password}</b>.<br><br>Click on 'Profile' tab once logged in to see company infromation.<br><br>Note: since company is managed through Odin Service Automation you will not be able to change company information directly from MyWeatherDemo.",
                username: at(company, "username"),
                password: at(company, "password")
            }],
            ["aps/FieldSet", { id: "properties", title: true}, [
                // using at module we specify to which property in the model the widget is connected
                // once a new value is provided it will be automatically synced back to model
                ["aps/TextBox", {id: "company_name", label: "Company Name", value: at(company, "company_name"), required: true}],
                ["aps/TextBox", {id: "username", label: "Username", value: at(company, "username"), required: true }],
                ["aps/TextBox", {id: "password", label: "Password", value: at(company, "password"), required: true }]
            ]]
    ]];

    load(widgets);

    // event handler for submit control button specified in APP-META.xml
    aps.app.onSubmit = function() {
        // we should not allow sending the data if required fields do not hold any values
        var page = registry.byId("apsPageContainer");
            // validate() method on PageContainer object goes over all the widget triggering validation for each of them
            if (!page.validate()) {
                aps.apsc.cancelProcessing();
                return;
            }
        when(store.put(company), function() {
            // cancelProcessing() will reset "Please wait" text back to "Submit Changes" once we receive confirmation from endpoint that company was updated successfully
            aps.apsc.cancelProcessing();
        });
    };
});
