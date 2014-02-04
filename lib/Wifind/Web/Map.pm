package Wifind::Web::Map;

use Mojo::Base 'Mojolicious::Controller';


sub map
{
	my $self = shift;

	$self->render('map/map');
}

1;
