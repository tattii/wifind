package Wifind::Web;

use Mojo::Base 'Mojolicious';


# This method will run once at server start
sub startup
{
	my $self = shift;

 	# Router
	my $r = $self->routes;
 	$r->namespaces(['Wifind::Web']);

 	$r->route('/')->to('Map#map');
	$r->route('/map')->to('Map#map');

	$r->route('/api/find')->to('API#find');
	$r->route('/api/spot')->to('API#spot');
	$r->route('/api/tip')->to('API#tip');

	$r->route('/spot/:id', id => qr/[0-9a-f]{1,20}/)->to('Spot#spot');

	$r->route('/contact')->to('Contact#contact');
	
	$r->route('/about')->to('Common#about');
	$r->route('/news')->to('Common#news');
	$r->route('/wifi')->to('Common#wifi');
	$r->route('/wifi/:service')->to('Common#service');
}






1;
