require(
    ["aps/ResourceStore",
    "dojox/mvc/getStateful",
    "dojox/mvc/at",
    "aps/load",
    "dojo/when",
    "dijit/registry",
    "aps/ready!"],
function(ResourceStore, getStateful, at, load, when, registry){

    var store = new ResourceStore({
        target: "/aps/2/resources/"
    });

    var company = getStateful(aps.context.vars.company);

    var widgets =
        ["aps/PageContainer", { id: "top_container" }, [
            ["aps/Output", {
                content: "Here you can update your company information.<br><br>To verify the changes log in to to <a href='http://www.myweatherdemo.com/login' target='_blank'>http://www.myweatherdemo.com/login</a> using username <b>${username}</b> and password <b>${password}</b>.<br><br>Click on 'Profile' tab once logged in to see company infromation.<br><br>Note: since company is managed through Odin Service Automation you will not be able to change company information directly from MyWeatherDemo.",
                username: at(company, "username"),
                password: at(company, "password")
            }],
            ["aps/FieldSet", { id: "properties", title: true}, [
                ["aps/TextBox", {label: "Company Name", value: at(company, "company_name"), required: true}],
                ["aps/TextBox", {label: "Username", value: at(company, "username"), required: true }],
                ["aps/TextBox", {label: "Password", value: at(company, "password"), required: true }]
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
            aps.apsc.cancelProcessing();
        });
    };
});
