---
layout: post
title:  "Helpful Wordpress Snippets"
date: 2019-04-13
published: true
tags: [wordpress]
---
Some helpful Wordpress snippets that I am always looking up.

### Conditional formatting for if statement to isolate a page.

```php
<?php
if( is_page(68)) {

      //Do stuff

}else{
    //Do other stuff
}
```

### Basic WP Query

```php
<?php
  $args = array('post_type' => 'sponsors');
// the query
$the_query = new WP_Query( $args ); ?>

<?php if ( $the_query->have_posts() ) : ?>

	<!-- pagination here -->

	<!-- the loop -->
	<?php while ( $the_query->have_posts() ) : $the_query->the_post(); ?>
		<h2><?php the_title(); ?></h2>
	<?php endwhile; ?>
	<!-- end of the loop -->

	<!-- pagination here -->

	<?php wp_reset_postdata(); ?>

<?php else : ?>
	<p><?php esc_html_e( 'Sorry, no posts matched your criteria.' ); ?></p>
<?php endif; ?>
```

### Repeater Field for Advanced custom Fields

```php
<?php

// check if the repeater field has rows of data
if( have_rows('repeater_field_name') ):

 	// loop through the rows of data
    while ( have_rows('repeater_field_name') ) : the_row();

        // display a sub field value
        the_sub_field('sub_field_name');

    endwhile;

else :

    // no rows found

endif;

?>
```

### Advanced Custom Fields Images

```php
<?php

$image = get_field('image');
$size = 'full'; // (thumbnail, medium, large, full or custom size)

if( $image ) {

	echo wp_get_attachment_image( $image, $size );

}

?>
```
