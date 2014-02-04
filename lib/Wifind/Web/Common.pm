package Wifind::Web::Common;

use Mojo::Base 'Mojolicious::Controller';

use Wifind::Model::Spot;

sub about
{
	my $self = shift;

	my $count = Wifind::Model::Spot::count();
	$self->stash('count', $count);

	$self->render('common/about');
}


sub news
{
	my $self = shift;
	$self->render('common/news');
}

sub wifi
{
	my $self = shift;
	$self->render('common/wifi');
}


sub service
{
	my $self = shift;

	my %enabled = (
		"kyoto_wifi" => 1,
		"fukuoka_city_wifi" => 1,
	);

	my $service= $self->stash("service");
	if ( defined $enabled{ $service } ){
		$self->render("common/service/$service");

	}else{
		$self->render_not_found;
	}
}



1;
