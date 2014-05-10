package Wifind::Web::API;

use Mojo::Base 'Mojolicious::Controller';

use Wifind::Model::Spot;
use Wifind::Model::Tip;


#----------------------------------------------------------
# find spot API
# /api/find?lat=35.135&lng=135.67
#
# parameters
# 	required
# 		lat & lng
# 		or
# 		bounds:
#
#	optional
#		limit: 100
#		zoom: 17
#		service: all
#
#----------------------------------------------------------
sub find
{
	my $self = shift;

	my $lat = $self->param('lat');
	my $lng = $self->param('lng');

	my $bounds = $self->param('bounds');

	my $zoom = $self->param('zoom') || 17;
	my $limit = $self->param('limit') || 100;

	my $service = $self->param('service');

	my $result;
	if ( defined $bounds ){
		if ( defined $service ){
			$result = Wifind::Model::Spot::findBoundsService(
				bounds => $bounds,
				zoom => $zoom,
				limit => $limit,
				service => $service,
			);

		}else{
			$result = Wifind::Model::Spot::findBounds(
				bounds => $bounds,
				zoom => $zoom,
				limit => $limit,
			);
		}

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


#----------------------------------------------------------
# spot API
# /api/spot?id=...
#
# parameters
#	id
#----------------------------------------------------------
sub spot
{
	my $self = shift;

	my $id = $self->param("id");

	if ( $id ){
		my $spot = Wifind::Model::Spot::getSpotData($id);
		$self->render( json => $spot );

	}else{	
		$self->render( json => { status => "id required!" });
	}
}



#----------------------------------------------------------
# tip API
# /api/tip?id=...
#
# parameters
#	id
#----------------------------------------------------------
sub tip
{
	my $self = shift;

	my $id = $self->param("id");

	if ( $id ){
		my $tip = Wifind::Model::Tip::get($id);
		$self->render( json => $tip );

	}else{
		$self->render( json => { status => "id required!" });
	}
}




1;
