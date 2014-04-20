package Wifind::Admin::Spot;

use Mojo::Base 'Mojolicious::Controller';

use Wifind::Model::Spot;


sub edit
{
	my $self = shift;
	return unless $self->digest_auth;

	my $method = $self->req->method;
	if ( lc $method eq "post" ){
		$self->post_edit();

	}else{
		$self->render_form();
	}
}

sub render_form
{
	my $self = shift;
	my $id = $self->stash("id");

	my $spot = Wifind::Model::Spot::getSpotData($id);
	$self->stash($spot);
	$self->render('admin/editSpot');

}


sub post_edit
{
	my $self = shift;
	my $id = $self->stash("id");

	my $spot = Wifind::Model::Spot::getSpotData($id);

	$spot->{name} = $self->param("name") || die;
	
	my $lat = $self->param("lat") || die;
	my $lng = $self->param("lng") || die;

	$spot->{loc}[0] = $lng += 0;
	$spot->{loc}[1] = $lat += 0;

	$spot->{location}{lat} = $lat;
	$spot->{location}{lng} = $lng;
	
	$spot->{spot}{address} = $self->param("spot.address") || "";
	$spot->{spot}{tel} = $self->param("spot.tel") || "";
	$spot->{spot}{hours}{string} = $self->param("spot.hours") || "";
	$spot->{spot}{category}[0]{string} = $self->param("spot.category") || "";
	$spot->{spot}{url} = $self->param("spot.url") || "";

	$spot->{wifi}{service} = $self->param("wifi.service") || die;
	$spot->{wifi}{power} = $self->param("wifi.power") || "";
	$spot->{wifi}{ssid} = $self->param("wifi.ssid") || "";
	$spot->{wifi}{url} = $self->param("wifi.url") || "";

	Wifind::Model::Spot::edit($spot);

	$self->render_form();
}


1;
