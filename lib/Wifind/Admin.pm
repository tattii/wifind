package Wifind::Admin;

use Mojo::Base 'Mojolicious';


# This method will run once at server start
sub startup
{
	my $self = shift;

 	# Router
	my $r = $self->routes;
	$r->namespaces(['Wifind::Admin']);
	
	$r->route('/edit/spot/:id', id => qr/[0-9a-f]{1,20}/)->to('Spot#edit');

	$r->route('/contact')->to('Contact#show');
	$r->route('/tip')->to('Tip#show');
}




1;
