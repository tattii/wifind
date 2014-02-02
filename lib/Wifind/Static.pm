package Wifind::Static;

use Mojo::Base 'Mojolicious::Controller';

use Wifind::Model::Spot;

sub about
{
	my $self = shift;

	my $count = Wifind::Model::Spot::count();
	$self->stash('count', $count);

	$self->render('static/about');
}


sub service
{
	my $self = shift;

	$self->render('static/service');
}



1;
