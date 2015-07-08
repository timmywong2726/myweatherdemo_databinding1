<?php
    require "aps/2/runtime.php";    

    /**
    * @type("http://myweatherdemo.com/databinding1/application/1.0")
    * @implements("http://aps-standard.org/types/core/application/1.0")
    */

    class app extends \APS\ResourceBase
    
    {
        /**
         * @link("http://myweatherdemo.com/databinding1/subscription_service/1.0[]")
         */
        public $companies;
        
        /**
         * @type(string)
         * @title("Token")
         * @encrypted
         */
        public $provider_token;          
    }
?>
