package Wifind::Map;

use Mojo::Base 'Mojolicious::Controller';


sub map
{
	my $self = shift;

	$self->render( template => 'map/map' );
}

1;
