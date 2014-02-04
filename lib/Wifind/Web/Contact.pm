package Wifind::Web::Contact;

use Mojo::Base 'Mojolicious::Controller';

use Wifind::Model::Contact;




sub contact
{	my $self = shift;

	my $method = $self->req->method;

	if ( lc $method eq "post" ){
		$self->post_contact();

	}else{
		$self->render_contact();
	}
}

sub render_contact
{
	my ($self, $modal) = @_;

	$self->stash(modal => $modal);
	$self->render('common/contact');
}


sub post_contact
{
	my $self = shift;

	my %param;

	$param{message} = $self->param("message");
	$param{name} = $self->param("name") || "unknown";
	$param{mail} = $self->param("mail") || "";

	if ( $param{message} && $param{name} && $param{mail}){
		Wifind::Model::Contact::add(\%param);
		$self->render_contact("お問い合わせありがとうございます！");

	}else{
		$self->render_contact("入力に不備があります。");
	}
}

1;
