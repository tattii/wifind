package Wifind::Spot;
use Mojo::Base 'Mojolicious::Controller';

use Data::Dumper;

use Wifind::Model::Spot;

sub spot
{
	my $self = shift;

	print Dumper $self->stash();

	my $spot = Wifind::Model::Spot::getSpotData( $self->stash("id") );

	$self->render($spot);
}

1;
