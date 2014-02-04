package Wifind::Web::Spot;

use Mojo::Base 'Mojolicious::Controller';

use Wifind::Model::Spot;
use Wifind::Model::Service;
use Wifind::Model::Tip;
use Wifind::Utility;


# post / get の切り替え
sub spot
{
	my $self = shift;

	my $method = $self->req->method;

	if ( lc $method eq "post" ){
		$self->post_tip();

	}else{
		$self->render_spot();
	}
}

# spotの表示
sub render_spot
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


sub post_tip
{
	my $self = shift;
	my $id = $self->stash("id");

	my %param;
	$param{spot_id} = $id;

	$param{message} = $self->param("message");
	$param{user} = $self->param("name") || "unknown";

	if ( $param{message} && $param{user} ){
		Wifind::Model::Tip::add(\%param);
		$self->render_spot("ご協力ありがとうございます！");

	}else{
		$self->render_spot("messageを入力してください");
	}
}




1;
