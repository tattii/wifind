package Wifind::Spot;

use Mojo::Base 'Mojolicious::Controller';

use Wifind::Model::Spot;
use Wifind::Model::Service;
use Wifind::Model::Tip;
use Wifind::Utility;

use Data::Dumper;

sub spot
{
	my ($self, $modal) = @_;
	my $id = $self->stash("id");

	my $spot = Wifind::Model::Spot::getSpotData($id);

	if ( $spot ){
		my $service = Wifind::Model::Service::getServiceData($spot->{wifi}->{service});
		my $tips = Wifind::Model::Tip::getSpotTips($id);

		$self->stash(id => $id);
		$self->stash($spot);
		$self->stash(service => $service);
		$self->stash(tips => $tips);
		$self->stash(modal => $modal || '');

		$self->render( template => 'spot/spot' );

	}else{
		$self->render_not_found;
	}

}


sub tip
{
	my $self = shift;
	my $id = $self->stash("id");

	my %param;
	$param{spot_id} = $id;

	$param{message} = $self->param("message");
	$param{user} = $self->param("name") || "unknown";

	if ( $param{message} && $param{user} ){
		Wifind::Model::Tip::add(\%param);
		$self->spot("ご協力ありがとうございます！");

	}else{
		$self->spot("messageを入力してください");
	}
}




1;
