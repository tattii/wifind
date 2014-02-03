package Wifind;

use Mojo::Base 'Mojolicious';


# This method will run once at server start
sub startup
{
	my $self = shift;

 	# Router
	my $r = $self->routes;

 	# Normal route to controller
 	$r->route('/')->to('Map#map');

	$r->route('/api/find')->to('API#find');
	$r->route('/api/spot')->to('API#spot');
	$r->route('/api/tip')->to('API#tip');

	$r->route('/map')->to('Map#map');
	$r->route('/spot/:id/tip', id => qr/[0-9a-f]{1,20}/)->to('Spot#tip');
	$r->route('/spot/:id', id => qr/[0-9a-f]{1,20}/)->to('Spot#spot');

	
	$r->route('/about')->to('Common#about');
	$r->route('/wifi')->to('Common#wifi');
	$r->route('/wifi/:service')->to('Common#service');
}






1;
