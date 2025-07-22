from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from django.utils import timezone
from .models import LoanSubmission

@receiver(user_logged_in)
def check_blacklist_on_login(sender, request, user, **kwargs):
    # Get unpaid loan submissions
    submissions = LoanSubmission.objects.filter(user=user, is_fully_paid=False)
    
    for submission in submissions:
        if submission.no_penalty_delay is not None and submission.no_penalty_delay >= 5:
            # Apply blacklist
            submission.user.is_blacklisted = True
            submission.user.blacklisted_date = timezone.now()
            submission.user.save()
            break
