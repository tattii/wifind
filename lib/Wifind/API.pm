package Wifind::API;

use Mojo::Base 'Mojolicious::Controller';

use Wifind::Model::Spot;



#----------------------------------------------------------
# SPOT API
# spot.pl?lat=35.135&lng=135.67&radius=500
#
# parameters
# 	required
# 		lat & lng
# 		or
# 		bounds:
#
#	optional
#		limit: 100
#		zoom: !!!
#
#----------------------------------------------------------
sub spot
{
	my $self = shift;

	my $lat = $self->param('lat');
	my $lng = $self->param('lng');

	my $bounds = $self->param('bounds');

	my $zoom = $self->param('zoom') || 17;
	my $limit = $self->param('limit') || 100;

	my $result;
	if ( defined $bounds ){
		$result = Wifind::Model::Spot::findBounds(
			bounds => $bounds,
			zoom => $zoom,
			limit => $limit,
		);

	}else{
		$result = Wifind::Model::Spot::findCenter(
			lat => $lat,
			lng => $lng,
			zoom => $zoom,
			limit => $limit,
		);
	}



	$self->render( json => $result );
}





1;
