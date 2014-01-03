package Wifind::Spot;

use Mojo::Base 'Mojolicious::Controller';

use Wifind::Model::Spot;
use Wifind::Model::Service;
use Wifind::Model::Tip;
use Wifind::Utility;

use Data::Dumper;

sub spot
{
	my $self = shift;
	my $id = $self->stash("id");

	my $spot = Wifind::Model::Spot::getSpotData($id);

	if ( $spot ){
		my $service = Wifind::Model::Service::getServiceData($spot->{wifi}->{service});
		my $tips = Wifind::Model::Tip::getSpotTips($id);

		$self->stash(id => $id);
		$self->stash($spot);
		$self->stash(service => $service);
		$self->stash(tips => $tips);

		$self->render( template => 'spot/spot' );

	}else{
		$self->render(
			text => 'spot not found',
			status => 404
		);
	}

}





1;
