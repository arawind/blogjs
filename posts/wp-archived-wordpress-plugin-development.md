---
layout: post
title: Wordpress Plugin Development
tags: archived-from-wp-backup, notes
createdAt: 2013-05-23 15:23:49
layout: post
---

Wordpress Plugin Development
----------------------------
$wpdb global object interfaces with the database

register_activation_hook('file', 'function') -- hook to run on plugin activation

dbDelta($sql) -- utility function in wp-admin/includes/upgrade.php -- examines table structure and modifies it as necessary

Adding administrative menu:
<ul>
	<li>add_action('admin_menu', 'AddOptionsPage')</li>
	<li>AddOptionsPage function will call add_menu_page or any other <a href="http://codex.wordpress.org/Adding_Administration_Menus">administrative menu functions</a></li>
	<li>add_submenu_page to add submenu</li>
	<li>In the callback functions for the menus, check for the user permissions to access the page.</li>
</ul>
<a href="http://codex.wordpress.org/Settings_API">Settings API</a> - processes the form semi automatically.
<ul>
	<li>add_settings_section</li>
	<li>add_settings_field</li>
	<li>register_settings_field</li>
</ul>
To trigger custom  action when button is pressed: Create a form with action - admin_url('admin-post.php'), and hidden field called action set to value 'something-you-want', and add_action('something-you-want', 'function-you-want-to-call') - <a title="stackexchange.com" href="http://wordpress.stackexchange.com/questions/79898/trigger-custom-action-when-setting-button-pressed">Detailed Explanation</a>