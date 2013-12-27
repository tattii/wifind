package Wifind::Spot;

use Mojo::Base 'Mojolicious::Controller';

use Wifind::Model::Spot;
use Wifind::Model::Service;
use Wifind::Utility;

use Data::Dumper;

sub spot
{
	my $self = shift;
	my $id = $self->stash("id");

	my $spot = Wifind::Model::Spot::getSpotData($id);

	if ( $spot ){
		#前処理
		$spot->{id} = $spot->{_id};
		$spot->{spot}->{short_url} = Wifind::Utility::shortenURL($spot->{spot}->{url});
		$spot->{wifi}->{short_url} = Wifind::Utility::shortenURL($spot->{wifi}->{url});
		
		my $service = Wifind::Model::Service::getServiceData($spot->{wifi}->{class});

		$self->stash($spot);
		$self->stash(service => $service);

		$self->render( template => 'spot/spot' );

	}else{
		$self->render(
			text => 'spot not found',
			status => 404
		);
	}

}





1;
