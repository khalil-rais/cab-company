<style>
    body{}
    <?php //================= Theme color primary ================== ?>
    <?php if(theme_get_setting('theme_color')){ ?>
        a:hover, a:focus, .btn-link:hover, .btn-link:focus,
        .pagination > li > a:hover, .pagination > li > a:focus,
        .pagination > li > span:hover,
        .pagination > li > span:focus,
        .gva-block-breadcrumb .breadcrumb-style a:hover, .gva-block-breadcrumb.text-white a:hover,
        .header-style-v1 header#header .navigation .gva_menu > li > a:hover, 
        .header-style-v2 header#header .navigation .gva_menu > li > a:hover,
        .footer a:hover, .copyright a:hover, .post-block .post-categories a,
        .style-dark .post-block .post-title a:hover,
        .post-style-stick.v3 .item-list > ul > li:first-child .post-block .post-title a:hover,
        .post-style-list.bg-black .post-block .post-title a:hover,
        .portfolio-v1 .content .title a:hover, .portfolio-v1 .content a:hover, .portfolio-v2 .category a:hover,
        .testimonial-carousel .testimonial-v1 .content-inner .title, .testimonial-carousel .testimonial-v2 .content-inner .title,
        .text-theme, .nav-tabs > li > a:hover, .nav-tabs > li > a:focus, .nav-tabs > li > a:active,
        .nav-tabs > li.active > a, .nav-tabs > li > a.active, .bean-tab .nav-tabs > li.active > a,
        .wrap-block-f-col .wrap-icon .inner-icon, .wrap-block-f-col:hover h3,
        .block .block-title, .block .block-title > span, .block.style-higlight .more-link a:hover,
        .block.block-blocktabs .ui-tabs-nav > li.ui-tabs-active > a, 
        nav.breadcrumb ol > li a:hover, .navigation .gva_menu > li > a:hover, .navigation .gva_menu > li > a.is-active,
        .navigation .gva_menu .sub-menu li a:hover,
        .gva-mega-menu .block-blocktabs .ui-tabs-nav > li.ui-tabs-active > a,
        .widget.gsc-heading .title strong, .widget.gsc-heading .title-icon,
        .widget.gsc-call-to-action .title strong, .widget.gsc-team .team-position,
        .widget.gsc-icon-box .link a, 
        .widget.gsc-icon-box.top-center .highlight-icon .icon,
        .widget.gsc-icon-box.top-left .highlight-icon .icon,
        .widget.gsc-icon-box.top-left-title .highlight-icon .icon,
        .widget.gsc-icon-box.top-right-title .highlight-icon .icon,
        .widget.gsc-icon-box.top-right .highlight-icon .icon,
        .widget.gsc-icon-box.right .highlight-icon .icon, .gsc-hover-background .front .icon,
        .widget.gsc-icon-box.left .highlight-icon .icon,
        .widget.milestone-block .milestone-icon span, .gsc-hover-box .icon span, 
        .gva-offcanvas-inner .gva-navigation .gva_menu > li > a:hover, 
        .gva-offcanvas-inner .gva-navigation .gva_menu > li ul.menu.sub-menu li a:hover,
        .gva-offcanvas-inner .gva-navigation .gva_menu li a:hover
        {
          color: <?php echo theme_get_setting('theme_color') ?>!important;
        }

        .pager .paginations a.active,
        .wrap-block-f-col:hover .wrap-icon .inner-icon
        {
          border-color: <?php echo theme_get_setting('theme_color') ?>!important;
        }

        .contact-message-form .form-item input[type='text']:focus, 
        .contact-message-form .form-item input[type='email']:focus, 
        .contact-message-form .form-item textarea:focus
        {
            border-bottom-color: <?php echo theme_get_setting('theme_color') ?>!important;
        }

        .pager .paginations a.active, #edit-preview, #edit-submit,
        .breaking-news .title, .portfolio-v1 .content .title a:after,
        .btn:hover, .btn:focus, .btn:active, .btn-theme, .progress .progress-bar,
        .pricing-table:hover .plan-name, .pricing-table.highlight-plan .plan-name,
        .wrap-block-f-col:hover .wrap-icon .inner-icon, #node-single-comment h2:before,
        .contact-message-form .form-actions #edit-preview, .contact-message-form .form-actions #edit-submit,
        .list-tags .view-list ul > li:hover, .poll .poll-item .bar .foreground, 
        .widget.gsc-call-to-action .button-action a, .widget.gsc-call-to-action.text-light .button-action a:hover,
        .widget.gsc-team.team-horizontal .team-name:after, 
        .widget.gsc-box-image .body .icon, .gsc-hover-box:hover .icon,
        .gavias-skins-panel .control-panel, .gavias-skins-panel .panel-skins-content .layout.active
        {
          background-color: <?php echo theme_get_setting('theme_color') ?>!important;
        }
    <?php } ?>     


    <?php //================= Body page ===================== ?>
    <?php if((theme_get_setting('text_color')) && theme_get_setting('text_color')){ ?>
        body .body-page{
            color: <?php echo theme_get_setting('text_color') ?>;
        }
    <?php } ?>

    <?php if((theme_get_setting('link_color')) && theme_get_setting('link_color')){ ?>
        body .body-page a{
            color: <?php echo theme_get_setting('link_color') ?>!important;
        }
    <?php } ?>

    <?php if((theme_get_setting('link_hover_color')) && theme_get_setting('link_hover_color')){ ?>
        body .body-page a:hover{
            color: <?php echo theme_get_setting('link_hover_color')?>!important;
        }
    <?php } ?>

    <?php //===================Header=================== ?>
    <?php if((theme_get_setting('header_bg')) && theme_get_setting('header_bg')){ ?>
        header .header-main{
            background: <?php echo theme_get_setting('header_bg') ?>!important;
        }
    <?php } ?>

    <?php if((theme_get_setting('header_color_link')) && theme_get_setting('header_color_link')){ ?>
        header .header-main a{
            color: <?php echo theme_get_setting('header_color_link') ?>!important;
        }
    <?php } ?>

    <?php if((theme_get_setting('header_color_link_hover')) && theme_get_setting('header_color_link_hover')){ ?>
        header .header-main a:hover{
            color: <?php echo theme_get_setting('header_color_link_hover') ?>!important;
        }
    <?php } ?>

    <?php //===================Menu=================== ?>
    <?php if((theme_get_setting('menu_bg')) && theme_get_setting('menu_bg')){ ?>
        .main-menu, ul.gva_menu{
            background: <?php echo theme_get_setting('menu_bg') ?>!important;
        }
    <?php } ?> 

    <?php if((theme_get_setting('menu_color_link')) && theme_get_setting('menu_color_link')){ ?>
        .main-menu ul.gva_menu > li > a{
            color: <?php echo theme_get_setting('menu_color_link') ?>!important;
        }
    <?php } ?> 

    <?php if((theme_get_setting('menu_color_link_hover')) && theme_get_setting('menu_color_link_hover')){ ?>
        .main-menu ul.gva_menu > li > a:hover{
            color: <?php echo theme_get_setting('menu_color_link_hover') ?>!important;
        }
    <?php } ?> 

    <?php if((theme_get_setting('submenu_background')) && theme_get_setting('submenu_background')){ ?>
        .main-menu .sub-menu{
            background: <?php echo theme_get_setting('submenu_background') ?>!important;
            color: <?php echo theme_get_setting('submenu_color') ?>!important;
        }
    <?php } ?> 

    <?php if((theme_get_setting('submenu_color')) && theme_get_setting('submenu_color')){ ?>
        .main-menu .sub-menu{
            color: <?php echo theme_get_setting('submenu_color') ?>!important;
        }
    <?php } ?> 

    <?php if((theme_get_setting('submenu_color_link')) && theme_get_setting('submenu_color_link')){ ?>
        .main-menu .sub-menu a{
            color: <?php echo theme_get_setting('submenu_color_link') ?>!important;
        }
    <?php } ?> 

    <?php if((theme_get_setting('submenu_color_link_hover')) && theme_get_setting('submenu_color_link_hover')){ ?>
        .main-menu .sub-menu a:hover{
            color: <?php echo theme_get_setting('submenu_color_link_hover') ?>!important;
        }
    <?php } ?> 

     <?php //===================Footer=================== ?>
    <?php if((theme_get_setting('footer_bg')) && theme_get_setting('footer_bg')){ ?>
        .footer, .footer .footer-center, .footer .footer-top{
            background: <?php echo theme_get_setting('footer_bg') ?>!important;
        }
    <?php } ?>

     <?php if((theme_get_setting('footer_color')) && theme_get_setting('footer_color')){ ?>
        .footer{
            color: <?php echo theme_get_setting('footer_color') ?> !important;
        }
    <?php } ?>

    <?php if((theme_get_setting('footer_color_link')) && theme_get_setting('footer_color_link')){ ?>
        .footer ul.menu > li a::after, .footer a{
            color: <?php echo theme_get_setting('footer_color_link') ?>!important;
        }
    <?php } ?>    

    <?php if((theme_get_setting('footer_color_link_hover')) && theme_get_setting('footer_color_link_hover')){ ?>
        .footer a:hover{
            color: <?php echo theme_get_setting('footer_color_link_hover') ?> !important;
        }
    <?php } ?>    

    <?php //===================Copyright======================= ?>
    <?php if((theme_get_setting('copyright_bg')) && theme_get_setting('copyright_bg')){ ?>
        .copyright{
            background: <?php echo theme_get_setting('copyright_bg') ?> !important;
        }
    <?php } ?>

     <?php if((theme_get_setting('copyright_color')) && theme_get_setting('copyright_color')){ ?>
        .copyright{
            color: <?php echo theme_get_setting('copyright_color') ?> !important;
        }
    <?php } ?>

    <?php if((theme_get_setting('copyright_color_link')) && theme_get_setting('copyright_color_link')){ ?>
        .copyright a{
            color: <?php echo theme_get_setting('copyright_color_link') ?>!important;
        }
    <?php } ?>    

    <?php if((theme_get_setting('copyright_color_link_hover')) && theme_get_setting('copyright_color_link_hover')){ ?>
        .copyright a:hover{
            color: <?php echo theme_get_setting('copyright_color_link_hover') ?> !important;
        }
    <?php } ?>    
</style>
