require(
    ["aps/ResourceStore",
    "dojox/mvc/getStateful",
    "dojox/mvc/at",
    "aps/load",
    "dijit/registry",
    "dojo/when",
    "aps/ready!"],
function(ResourceStore, getStateful, at, load, registry, when){

    var store = new ResourceStore({
        target: "/aps/2/resources/"
    });

    var company = getStateful(aps.context.vars.company);

    var widgets =
        ["aps/PageContainer", { id: "top_container" }, [
            ["aps/Output", { id: "info", value: "Here you can edit your company's information. To verify the changes log in to customer area on http://www.myweatherdemo.com"}],
            ["aps/FieldSet", { id: "properties", title: true}, [
                ["aps/TextBox", { id: "company_name", label: "Company Name", value: at(company, "company_name"), required: true}],
                ["aps/TextBox", { id: "username", label: "Username", value: at(company, "username"), required: true }],
                ["aps/TextBox", { id: "password", label: "Password", value: at(company, "password"), required: true }]
            ]]
    ]];

    load(widgets);

    aps.app.onSubmit = function() {
        var page = registry.byId("top_container");
            if (!page.validate()) {
                aps.apsc.cancelProcessing();
                return;
            }
        when(store.put(company), function() {
            aps.apsc.gotoView("temperature");
        });
    };
});
